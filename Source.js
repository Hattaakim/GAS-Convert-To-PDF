function onFormSubmit(e){
  try{
    var itemResponses = e.response.getItemResponses();
    var respondentEmail = e.response.getRespondentEmail();
    var fileID = [];
    var hasil = [];
    
    for (var i = 0; i < itemResponses.length; i++){
      var itemResponse = itemResponses[i];
      var response = itemResponse.getResponse();

      if(itemResponse.getItem().getType() == FormApp.ItemType.FILE_UPLOAD){
        fileID = Array.isArray(response) ? response:[response];
      }
    }

    if (!respondentEmail || fileID.length == 0){
        Logger.log("Informasi: Pengisian user tidak sesuai");
    }
    
    hasil = convertFileToPDF(fileID)
    if (hasil.length > 0){
      kirimEmail(
        respondentEmail,
        "Convert To PDF - Konversi Berhasil (No-Reply)",
        "Halo, terima kasih telah menggunakan layanan konversi kami. Berikut ini adalah " + hasil.length + " file office Anda yang telah dikonversi menjadi file PDF.",
        hasil
      );
    }
  }
  catch (error){
    kirimEmail(
      respondentEmail,
      "Convert To PDF - Konversi Gagal (No-Reply)",
      "Maaf atas ketidaknyamanannya. Kami mengalami kegagalan dalam mengonversi file Anda menjadi PDF. File Anda telah dihapus secara otomatis dari server kami untuk menjaga privasi Anda. Masalah ini diakibatkan karena kesalahan berikut ini:\n\n [" + error.message + "]\n\nMasalah tersebut telah disampaikan kepada pihak pengembang dan akan dilakukan perbaikan segera bila masalah yang ditemui benar - benar merupakan kegagalan pada sistem kami.\n\nTerima kasih atas perhatian Anda!"
    );
    var cacheIDHarusDihapus = [];
    for (var a = 0; a < fileID.length; a++){
      cacheIDHarusDihapus.push(fileID[a]);
    clearCache(cacheIDHarusDihapus);
    Logger.log("Terjadi Error: " + error.stack);
    }
  }
}

function kirimEmail(respondentEmail, judul, bodytext, attachments){
  let optionAttachments = {};
  if (attachments){
    optionAttachments["attachments"] = attachments;
  }

  GmailApp.sendEmail(
    respondentEmail, 
    judul,
    bodytext, 
    optionAttachments
  );
}

function convertFileToPDF(fileIDList){
  const mimeMapNonGoogle = {
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document": MimeType.GOOGLE_DOCS, // docx
    "application/msword": MimeType.GOOGLE_DOCS, // doc
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": MimeType.GOOGLE_SHEETS, // xlsx
    "application/vnd.ms-excel": MimeType.GOOGLE_SHEETS, // xls
    "application/vnd.openxmlformats-officedocument.presentationml.presentation": MimeType.GOOGLE_SLIDES, // pptx
    "application/vnd.ms-powerpoint": MimeType.GOOGLE_SLIDES // ppt
  };
  const mimeMapGoogle = {
    "application/vnd.google-apps.spreadsheet": MimeType.GOOGLE_SHEETS,
    "application/vnd.google-apps.presentation": MimeType.GOOGLE_SLIDES,
    "application/vnd.google-apps.docs":MimeType.GOOGLE_DOCS
  }
  var allFinishedBlob = [];
  var cacheIDHarusDihapus = [];

  for (var a = 0; a < fileIDList.length; a++){
    var fileasliID = fileIDList[a];
    var fileAsliPTR = DriveApp.getFileById(fileasliID);
    cacheIDHarusDihapus.push(fileasliID);

    var mimetype = fileAsliPTR.getMimeType();
    var filename = fileAsliPTR.getName();
    var filebasename = filename.lastIndexOf(".") !== -1 ? filename.substring(0, filename.lastIndexOf(".")) : filename;
    var readyToConvertFile;
    var pdfDataBlob;

    //jika bukan tipe google, harus diubah dulu
    if (mimeMapNonGoogle.hasOwnProperty(mimetype)){
      var res = {
        name: "TEMP_" + filebasename,
        mimeType: mimeMapNonGoogle[mimetype]
      };
      var createTempFile = Drive.Files.create(res, fileAsliPTR.getBlob());
      readyToConvertFile = DriveApp.getFileById(createTempFile["id"]);
      cacheIDHarusDihapus.push(createTempFile["id"]);
    }

    //jika tipe google ga usah diconvert
    else if (mimeMapGoogle.hasOwnProperty(mimetype)){
      readyToConvertFile = fileAsliPTR;
    }

    pdfDataBlob = readyToConvertFile.getAs(MimeType.PDF).setName(filebasename + ".pdf");
    allFinishedBlob.push(pdfDataBlob)
  }
  clearCache(cacheIDHarusDihapus);
  return allFinishedBlob;
}

function clearCache(allCacheID){
  for (var c = 0; c < allCacheID.length; c++){
    Drive.Files.remove(allCacheID[c]);
  }
}
