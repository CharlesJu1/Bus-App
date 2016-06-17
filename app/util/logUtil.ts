
export function logError(prefix: String) {
    return function(error: any) {
      console.log(prefix + ':' + JSON.stringify(error));
    }
}


export function overWriteFile(fileEntry, dataObj) {
  // Create a FileWriter object for our FileEntry.
  console.log('overWriteFile: dataObj=' + dataObj);

  // deletes and re-creates the specified file
  // var createFile = function(fileName, success, error) {
  //   deleteEntry(fileName, function() {
  //     root.getFile(fileName, {
  //       create: true
  //     }, success, error);
  //   }, error);
  // };


  fileEntry.createWriter(function(fileWriter) {

    fileWriter.onwriteend = function () {
      console.log('truncate existing file callback');
      fileWriter.onwriteend = function () {
        console.log('write new data callback');
      }
      fileWriter.onerror = logError('Failed to write data');

      fileWriter.seek(0);
      fileWriter.write(dataObj);
    }

    fileWriter.onerror = logError('Failed to truncate file ');

    //truncate() will call onwriteend.
    fileWriter.truncate(20);
  });
}

export function readFile(fileEntry, readFileCb) {

  fileEntry.file(function(file) {
      var reader = new FileReader();
      reader.onloadend = function() {

        //this in the following points to fileEntry.file
        console.log("Successful file read: " + this.result);
        readFileCb(this.result);
      };

      reader.readAsText(file);
    }, logError('Error reading file ')); 
}