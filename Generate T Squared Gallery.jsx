var orig_ruler_units = app.preferences.rulerUnits
var orig_type_units = app.preferences.typeUnits
var orig_display_dialogs = app.displayDialogs
app.preferences.rulerUnits = Units.PIXELS // Set the ruler units to PIXELS
app.preferences.typeUnits = TypeUnits.POINTS // Set Type units to POINTS
app.displayDialogs = DialogModes.NO // Set Dialogs off

function main() {
	//Select Photos
	//Top Folder to look for things
	var topFolder = Folder.selectDialog('Select the folder with the photos in it.')

	var fileandfolderAr = scanSubFolders(topFolder, /\.(jpg|tif|psd|bmp|gif|png|)$/i)
	//alert('Scan of ' + topFolder.fullName + '\n' + fileandfolderAr[0].length + ' files\nLast File: ' + decodeURI(fileandfolderAr[0][fileandfolderAr[0].length-1]));
	//alert('Scan of ' + topFolder.fullName + '\n' + fileandfolderAr[1].length + ' folders\nLast Folder: ' + decodeURI(fileandfolderAr[1][fileandfolderAr[1].length-1]));

	var processedFolder = new Folder(topFolder.fullName + '-processed')
	//Check if it exist, if not create it.
	if (processedFolder.exists) {
		if (confirm('Overwrite existing processed folder?')) {
			processedFolder.create()
		} else {
			alert('No place to store data.')
			return
		}
	} else {
		processedFolder.create()
	}

	//Process Files
	var fileList = fileandfolderAr[0]
	for (var i = 0; i < fileList.length; i++) {
		var thisFile = fileList[i]

		open(thisFile)

		var nameWithoutSpaces = thisFile.fullName.replace(/\s+/g, '-')

		//Save Image
		var saveFile = File(nameWithoutSpaces.replace(topFolder.fullName, processedFolder.fullName))
		if (saveFile.exists) {
			saveFile.remove()
		}
		ResizeWithAspect(1200)
		SaveForWeb(saveFile, 100)

		//Save Thumbnail
		var saveFile = File(
			nameWithoutSpaces
				.substr(0, nameWithoutSpaces.lastIndexOf('.'))
				.replace(topFolder.fullName, processedFolder.fullName) + '-thumb.jpg'
		)
		if (saveFile.exists) {
			saveFile.remove()
		}
		ResizeWithAspect(150)
		SaveForWeb(saveFile, 30)

		app.activeDocument.close(SaveOptions.DONOTSAVECHANGES)
	}
}

try {
	main()
} catch (e) {
	alert(e + ': on line ' + e.line, 'Script Error', true)
}

function SaveForWeb(saveFile, jpegQuality) {
	var foldersList = saveFile.path.split('/')
	var path = ''
	for (var i = 0; i < foldersList.length; i++) {
		var thisFolder = foldersList[i]

		if (i < foldersList.length - 1) {
			path += thisFolder + '/'
		} else {
			path += thisFolder
		}

		var f = Folder(path)
		if (!f.exists) {
			f.create()
		}
	}

	var sfwOptions = new ExportOptionsSaveForWeb()
	sfwOptions.format = SaveDocumentType.JPEG
	sfwOptions.includeProfile = false
	sfwOptions.interlaced = 0
	sfwOptions.optimized = true
	sfwOptions.quality = jpegQuality //0-100
	activeDocument.exportDocument(saveFile, ExportType.SAVEFORWEB, sfwOptions)
}

function ResizeWithAspect(width) {
	// get a reference to the current (active) document and store it in a variable named "doc"
	doc = app.activeDocument

	//Image Aspect Ratio
	var ratio = doc.height / doc.width

	// these are our values for the END RESULT width and height (in pixels) of our image
	var fWidth = width
	var fHeight = fWidth * ratio

	//Resize
	//Only resize if larger
	if (doc.width > width) {
		doc.resizeImage(UnitValue(fWidth, 'px'), null, null, ResampleMethod.BICUBIC)
	}
}

function scanSubFolders(tFolder, mask) {
	// folder object, RegExp or string
	var sFolders = new Array()
	var allFiles = new Array()
	sFolders[0] = tFolder
	for (var j = 0; j < sFolders.length; j++) {
		// loop through folders
		var procFiles = sFolders[j].getFiles()
		for (var i = 0; i < procFiles.length; i++) {
			// loop through this folder contents
			if (procFiles[i] instanceof File) {
				if (mask == undefined) allFiles.push(procFiles[i]) // if no search mask collect all files
				if (procFiles[i].fullName.search(mask) != -1) allFiles.push(procFiles[i]) // otherwise only those that match mask
			} else if (procFiles[i] instanceof Folder) {
				sFolders.push(procFiles[i]) // store the subfolder
				scanSubFolders(procFiles[i], mask) // search the subfolder
			}
		}
	}
	return [allFiles, sFolders]
}

app.displayDialogs = orig_display_dialogs // Reset display dialogs
app.preferences.typeUnits = orig_type_units // Reset ruler units to original settings
app.preferences.rulerUnits = orig_ruler_units // Reset units to original settings
