Dropzone.autoDiscover = false;

document.addEventListener('DOMContentLoaded', () => {

	const uploadField = document.querySelector('#file-upload');

	if(uploadField) {

        const theDropzone = document.querySelector('.the-dropzone');
        let dropzoneError = theDropzone.querySelector('.error-message');
        let dropzoneSuccess = theDropzone.querySelector('.success-message');

        let dropzone = new Dropzone(uploadField, {
            url: 'upload.php',
            addRemoveLinks: true,
            parallelUploads: 1,
            acceptedFiles: '.jpg,.jpeg,.png',
            maxFiles: 1,
            maxFilesize: 10,
            dictDefaultMessage: '<div class="dz-message needsclick">Загрузить скриншот</div>',
            dictFallbackMessage: "Ваш браузер не поддерживает загрузку перетаскиванием",
            dictFallbackText: "Пожалуйста, используйте резервную форму ниже, чтобы загрузить свои файлы, как в старые добрые времена)",
            dictFileTooBig: "Слишком большой файл ({{filesize}}Мб). Максимальный размер: {{maxFilesize}}Мб.",
            dictInvalidFileType: "Вы не можете загрузить файлы этого типа.",
            dictResponseError: "Сервер вернул ответ {{statusCode}}.",
            dictCancelUpload: "Отменить загрузку",
            dictUploadCanceled: "Загрузка завершена.",
            dictCancelUploadConfirmation: "Вы уверены, что хотите отменить?",
            dictRemoveFile: "Удалить файл",
            dictRemoveFileConfirmation: "Хотите удалить файл?",
            dictMaxFilesExceeded: 'Привышен лимит изображений',
            dictFileSizeUnits: {
                tb: "Тб",
                gb: "Гб",
                mb: "Мб",
                kb: "Кб",
                b: "байт"
            },
            init: function(){
                // console.log(this)
                this.element.innerHTML = this.options.dictDefaultMessage;
                this.on('addedfile', function(file) {
                    if (this.files.length > 1) {
                        this.removeFile(this.files[0]);
                    }
                })
            },
            thumbnail: function(file, dataUrl) {
                if (file.previewElement) {
                    file.previewElement.classList.remove("dz-file-preview");
                    let images = file.previewElement.querySelectorAll("[data-dz-thumbnail]");
                    for (let i = 0; i < images.length; i++) {
                        let thumbnailElement = images[i];
                        thumbnailElement.alt = file.name;
                        thumbnailElement.src = dataUrl;
                        url = dataUrl;
                    }
                    setTimeout(function() { file.previewElement.classList.add("dz-image-preview"); }, 1);
                }
            },
            success: function(file, response){
                response = JSON.parse(response);
                // console.log(file);
                if (response.answer == 'error') {
                    dropzoneSuccess.style.display = 'none';
                    dropzoneError.innerText = response.error;
                    dropzoneError.style.display = 'block';
                    dropzone.removeFile(file);
                }else{
                    dropzoneError.style.display = 'none';
                    dropzoneSuccess.innerText = response.answer;
                    dropzoneSuccess.style.display = 'block';
                    // this.defaultOptions.success(file);
                }
                // console.log(res);
            },
            removedfile: function (file) {
                file.previewElement.remove();
                dropzoneSuccess.style.display = 'none';
                dropzoneError.style.display = 'none';
                const request = new XMLHttpRequest();

                const url = "delete.php";
                request.open("POST", url, true);
                request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
                request.addEventListener("readystatechange", () => {
                    if(request.readyState === 4 && request.status === 200) {
                        dropzoneSuccess.innerText = request.responseText;
                        dropzoneSuccess.style.display = 'block';
                        // console.log(request.responseText);
                    }
                });
                request.send();
            }
        });

	} // end uploadField

});