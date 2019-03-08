//
// Blog Photo Generator
//		Goal: Assist in helping saving images for the 38th Blog
//
//
var orig_ruler_units = app.preferences.rulerUnits
var orig_type_units = app.preferences.typeUnits
var orig_display_dialogs = app.displayDialogs
app.preferences.rulerUnits = Units.PIXELS // Set the ruler units to PIXELS
app.preferences.typeUnits = TypeUnits.POINTS // Set Type units to POINTS
app.displayDialogs = DialogModes.NO // Set Dialogs off

var inputFolder = ''

function main() {
	//Set Folder To Save In
	inputFolder = Folder.selectDialog('Select a folder to save the photos in to.')

	//Header Image
	if (confirm('Do you have a header image to process?')) {
		processHeaderImage()
	}

	//Body Images
	if (confirm('Do you have a body image to process?')) {
		var anotherImage = true
		while (anotherImage) {
			processBodyImage()

			if (!confirm('Do you have another body image to process?')) {
				anotherImage = false
			}
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

try {
	main()
} catch (e) {
	alert(e + ': on line ' + e.line, 'Script Error', true)
}

function processHeaderImage() {
	//Load File and Open
	var anotherImage = true
	while (anotherImage) {
		var myFile = File.openDialog(
			'Please select your header image. This will generate a header image with a width of 1200px and a thumbnail image with it.'
		)
		if (myFile != null) {
			app.open(myFile)
			anotherImage = false
		} else if (
			!confirm('Error: Unable to open file provided. Would you like to try another?')
		) {
			anotherImage = false
			return
		}
	}

	//Variables
	var doc = app.activeDocument
	var name = doc.name.substr(0, doc.name.lastIndexOf('.')) || doc.name
	var isJpg = confirm('Is this a real life photo? (jpg vs png)')

	//Check Dimensions
	if (doc.width > 1200) {
		doc.resizeImage(UnitValue(1200, 'px'), null, null, ResampleMethod.BICUBICSHARPER)
	}

	//Save Background Photo
	if (isJpg) {
		var newFile = new File(inputFolder + '/' + name + '.jpg')
		var sfwOptions = new ExportOptionsSaveForWeb()
		sfwOptions.format = SaveDocumentType.JPEG
		sfwOptions.includeProfile = false
		sfwOptions.interlaced = 0
		sfwOptions.optimized = true
		sfwOptions.quality = 100 //0-100
		activeDocument.exportDocument(newFile, ExportType.SAVEFORWEB, sfwOptions)
	} else {
		var newFile = new File(inputFolder + '/' + name + '.png')
		var sfwOptions = new ExportOptionsSaveForWeb()
		sfwOptions.format = SaveDocumentType.PNG
		sfwOptions.optimized = true
		sfwOptions.PNG8 = false
		sfwOptions.quality = 1
		doc.exportDocument(newFile, ExportType.SAVEFORWEB, sfwOptions)
	}

	var thumbnailSize = 280
	if (confirm('Is this a featured post? (580px vs 280px)')) {
		thumbnailSize = 580
	}

	if (doc.width > thumbnailSize) {
		doc.resizeImage(UnitValue(thumbnailSize, 'px'), null, null, ResampleMethod.BICUBICSHARPER)
	}

	//Save Thumb Photo
	if (isJpg) {
		var newFile = new File(inputFolder + '/' + name + '-thumb.jpg')
		var sfwOptions = new ExportOptionsSaveForWeb()
		sfwOptions.format = SaveDocumentType.JPEG
		sfwOptions.includeProfile = false
		sfwOptions.interlaced = 0
		sfwOptions.optimized = true
		sfwOptions.quality = 100 //0-100
		activeDocument.exportDocument(newFile, ExportType.SAVEFORWEB, sfwOptions)
	} else {
		var newFile = new File(inputFolder + '/' + name + '-thumb.png')
		var sfwOptions = new ExportOptionsSaveForWeb()
		sfwOptions.format = SaveDocumentType.PNG
		sfwOptions.optimized = true
		sfwOptions.PNG8 = false
		sfwOptions.quality = 1
		doc.exportDocument(newFile, ExportType.SAVEFORWEB, sfwOptions)
	}

	//Close
	app.activeDocument.close(SaveOptions.DONOTSAVECHANGES)
}

function processBodyImage() {
	//Load File and Open
	var anotherImage = true
	while (anotherImage) {
		var myFile = File.openDialog(
			'Please select your body image. This will generate a header image with a width of 800px.'
		)
		if (myFile != null) {
			app.open(myFile)
			anotherImage = false
		} else if (
			!confirm('Error: Unable to open file provided. Would you like to try another?')
		) {
			anotherImage = false
			return
		}
	}

	//Variables
	var doc = app.activeDocument
	var name = doc.name.substr(0, doc.name.lastIndexOf('.')) || doc.name
	var isJpg = confirm('Is this a real life photo? (jpg vs png)')

	//Check Dimensions
	if (doc.width > 800) {
		doc.resizeImage(UnitValue(800, 'px'), null, null, ResampleMethod.BICUBICSHARPER)
	}

	var name = doc.name.substr(0, doc.name.lastIndexOf('.')) || doc.name
	//Save Photo
	if (isJpg) {
		var newFile = new File(inputFolder + '/' + name + '.jpg')
		var sfwOptions = new ExportOptionsSaveForWeb()
		sfwOptions.format = SaveDocumentType.JPEG
		sfwOptions.includeProfile = false
		sfwOptions.interlaced = 0
		sfwOptions.optimized = true
		sfwOptions.quality = 100 //0-100
		activeDocument.exportDocument(newFile, ExportType.SAVEFORWEB, sfwOptions)
	} else {
		var newFile = new File(inputFolder + '/' + name + '.png')
		var sfwOptions = new ExportOptionsSaveForWeb()
		sfwOptions.format = SaveDocumentType.PNG
		sfwOptions.optimized = true
		sfwOptions.PNG8 = false
		sfwOptions.quality = 1
		doc.exportDocument(newFile, ExportType.SAVEFORWEB, sfwOptions)
	}

	//Close
	app.activeDocument.close(SaveOptions.DONOTSAVECHANGES)
}

app.displayDialogs = orig_display_dialogs // Reset display dialogs
app.preferences.typeUnits = orig_type_units // Reset ruler units to original settings
app.preferences.rulerUnits = orig_ruler_units // Reset units to original settings
