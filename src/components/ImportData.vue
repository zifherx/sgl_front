<template>
	<div>
		<input class="excel-upload-input" ref="excel-upload-input" type="file" accept=".xlsx, .xls" @change="handleClick" />
		<div class="drop" @drop="handleDrop" @dragover="handleDragover" @dragenter="handleDragover">
			Arrastra el archivo de excel aquí o
			<v-btn class="ml-2" x-large :loading="loading" color="primary" @click="handleUpload">
				<span>Súbelo</span>
			</v-btn>
		</div>
	</div>
</template>
<script>
import * as XLSX from "xlsx";

export default {
	props: {
		beforeUpload: Function,
		onSuccess: Function,
	},

	data() {
		return {
			loading: false,
			excelData: {
				header: null,
				results: null,
			},
		};
	},

	methods: {
		generateData({ results }) {
			this.excelData.results = results;
			this.onSuccess && this.onSuccess(this.excelData);
		},

		subirArchivo(event) {
			let file = event.target.files ? event.target.files[0] : null;

			if (file) {
				return new Promise((resolve, reject) => {
					const reader = new FileReader();
					reader.onload = (e) => {
						const data = e.target.result;
						const workbook = XLSX.read(data, { type: "binary" });
						const sheetName = workbook.SheetNames[0];
						const worksheet = workbook.Sheets[sheetName];
						const results = XLSX.utils.sheet_to_json(worksheet);

						this.generateData({ results });
						resolve();
					};
					reader.readAsBinaryString(file);
				});
			}
		},

		handleClick(e) {
			const files = e.target.files;
			const rawFile = files[0];
			if (!rawFile) return;
			this.upload(rawFile);
		},

		upload(rawFile) {
			this.$refs["excel-upload-input"].value = null;
			if (!this.beforeUpload) {
				this.readerData(rawFile);
				return;
			}
			const before = this.beforeUpload(rawFile);
			if (before) this.readerData(rawFile);
		},

		handleDrop(e) {
			e.stopPropagation();
			e.preventDefault();
			if (this.loading) return;
			const files = e.dataTransfer.files;
			if (files.length !== 1) {
				this.$message.error("Only support uploading one file ");
				return;
			}
			const rawFile = files[0];
			if (!this.isExcel(rawFile)) {
				this.$message.error("Only supports upload .xlsx, .xls, .csv suffix files");
				return false;
			}
			this.upload(rawFile);
			e.stopPropagation();
			e.preventDefault();
		},

		readerData(rawFile) {
			this.loading = true;
			return new Promise((resolve, reject) => {
				const reader = new FileReader();
				reader.onload = (e) => {
					const data = e.target.result;
					const workbook = XLSX.read(data, { type: "array" });
					const firstSheetName = workbook.SheetNames[0];
					const worksheet = workbook.Sheets[firstSheetName];
					const results = XLSX.utils.sheet_to_json(worksheet);

					this.generateData({ results });
					this.loading = false;
					resolve();
				};
				reader.readAsArrayBuffer(rawFile);
			});
		},

		handleDragover(e) {
			e.stopPropagation();
			e.preventDefault();
			e.dataTransfer.dropEffect = "copy";
		},

		handleUpload() {
			this.$refs["excel-upload-input"].click();
		},

		isExcel(file) {
			return /\.(xlsx|xls|csv)$/.test(file.name);
		},
	},
};
</script>
<style>
.excel-upload-input {
	display: none;
	z-index: -9999;
}
.drop {
	border: 2px dashed #bbb;
	width: 600px;
	height: 160px;
	line-height: 160px;
	margin: 0 auto;
	font-size: 24px;
	border-radius: 5px;
	text-align: center;
	color: #bbb;
	position: relative;
}

@media only screen and (max-width: 595px) {
	.drop {
		width: 300px;
		font-size: 15px;
		line-height: 60px;
	}
}
</style>
