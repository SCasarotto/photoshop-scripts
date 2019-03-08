var orig_ruler_units = app.preferences.rulerUnits
var orig_type_units = app.preferences.typeUnits
var orig_display_dialogs = app.displayDialogs
app.preferences.rulerUnits = Units.PIXELS // Set the ruler units to PIXELS
app.preferences.typeUnits = TypeUnits.POINTS // Set Type units to POINTS
app.displayDialogs = DialogModes.NO // Set Dialogs off

function main() {
	//Set Units To Pixels
	app.preferences.rulerUnits = Units.PIXELS

	//Select Photos
	//Top Folder to look for things
	var topFolder = Folder.selectDialog('Select the folder with the photos in it.')

	var fileandfolderAr = scanSubFolders(topFolder, /\.(jpg|tif|psd|bmp|gif|png|)$/i)
	//alert('Scan of ' + topFolder.fullName + '\n' + fileandfolderAr[0].length + ' files\nLast File: ' + decodeURI(fileandfolderAr[0][fileandfolderAr[0].length-1]));
	//alert('Scan of ' + topFolder.fullName + '\n' + fileandfolderAr[1].length + ' folders\nLast Folder: ' + decodeURI(fileandfolderAr[1][fileandfolderAr[1].length-1]));

	//Location For Text File
	var htmlFileLocation = Folder.selectDialog('Select the folder to save the html code.')

	//HTML String
	var htmlString = '<div class="my-gallery" itemscope itemtype="http://schema.org/ImageGallery">'

	//Process Files
	var fileList = fileandfolderAr[0]
	for (var i = 0; i < fileList.length; i++) {
		var thisFile = fileList[i]

		var thumbRegex = /-thumb./gi

		//Skip Thumb Images
		if (!thumbRegex.exec(thisFile.fullName)) {
			open(thisFile)

			var filePath = thisFile.fullName.replace(topFolder, '')

			var doc = app.activeDocument
			var name = doc.name.substr(0, doc.name.lastIndexOf('.')) || doc.name

			htmlString +=
				'<figure itemprop="associatedMedia" itemscope itemtype="http://schema.org/ImageObject"><a href="{{ url_for(\'static\',filename=\'img/EAGR-Images'
			htmlString += filePath
			htmlString += '\') }}" itemprop="contentUrl" data-size="'
			htmlString +=
				String(doc.width.valueOf()).replace(' px', '') +
				'x' +
				String(doc.height.valueOf()).replace(' px', '')
			htmlString +=
				'"><img src="#" delayedsrc="{{ url_for(\'static\',filename=\'img/EAGR-Images'
			htmlString += filePath.substr(0, filePath.lastIndexOf('.')) + '-thumb.jpg'
			htmlString +=
				'\') }}" itemprop="thumbnail" alt="Image description" /></a><figcaption itemprop="caption description">'
			htmlString += name
			htmlString += '</figcaption></figure>'

			app.activeDocument.close(SaveOptions.DONOTSAVECHANGES)
			//return;
		}
	}

	htmlString += '</div>'

	var saveFile = File(htmlFileLocation + '/' + 'galleryCode' + '.txt')

	if (saveFile.exists) saveFile.remove()

	saveFile.encoding = 'UTF8'
	saveFile.open('e', 'TEXT', '????')
	saveFile.writeln(htmlString)
	saveFile.close()
}
try {
	main()
} catch (e) {
	alert(e + ': on line ' + e.line, 'Script Error', true)
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
