//
// App Icon Generator
//		Goal: Generate app icons of all requested sizes and appropriately name them.
//
//
//	Sizes to generate and names
//
//	iPhone
//		40px	-	20@2x
//		60px	-	20@3x
//		58px	-	29@2x
//		87px	-	29@3x
//		80px	-	40@2x
//		120px	-	40@3x, 60@2x
//		180px	-	60@3x
//
//	iPad
//		20px	-	20@1x
//		40px	-	20@2x
//		29px	-	29@1x
//		58px	-	29@2x
//		40px	-	40@1x
//		80px	-	40@2x
//		76px	-	76@1x
//		152px	-	76@2x
//		167px	-	83-5@2x
//
var orig_ruler_units = app.preferences.rulerUnits
var orig_type_units = app.preferences.typeUnits
var orig_display_dialogs = app.displayDialogs
app.preferences.rulerUnits = Units.PIXELS // Set the ruler units to PIXELS
app.preferences.typeUnits = TypeUnits.POINTS // Set Type units to POINTS
app.displayDialogs = DialogModes.NO // Set Dialogs off

function main() {
	if (!documents.length) {
		alert('Open the file you would like to process.')
		return
	}

	//Check if there is already a folder
	var doc = app.activeDocument
	var f = Folder(doc.path + '/newAppIcons')
	if (!f.exists) {
		f.create()
	} else if (confirm('There is already a folder of new app icons. Is it okay to overwrite it?')) {
		f.create()
	} else {
		alert('Stopping script. Please move/rename existing folder and try again.')
		return
	}

	//Prompt for image outputs
	var iPhoneSizes = confirm('Do you need icons for iPhone?')
	var iPadSizes = confirm('Do you need icons for iPad?')

	//Create Dicts and Generate Icons
	if (iPhoneSizes) {
		var iphoneSizesDict = {
			'20@2x': 40,
			'20@3x': 60,
			'29@2x': 58,
			'29@3x': 87,
			'40@2x': 80,
			'40@3x': 120,
			'60@2x': 120,
			'60@3x': 180,
		}
		generateIconsFromDict(iphoneSizesDict, 'iphone')
	}
	if (iPadSizes) {
		var ipadSizesDict = {
			'20@1x': 20,
			'20@2x': 40,
			'29@1x': 29,
			'29@2x': 58,
			'40@1x': 40,
			'40@2x': 80,
			'76@1x': 76,
			'76@2x': 152,
			'83-5@2x': 167,
		}
		generateIconsFromDict(ipadSizesDict, 'ipad')
	}
}
try {
	main()
} catch (e) {
	alert(e + ': on line ' + e.line, 'Script Error', true)
}

function generateIconsFromDict(dict, folder) {
	var doc = app.activeDocument
	var name = doc.name.substr(0, doc.name.lastIndexOf('.')) || doc.name
	var newPath = doc.path + '/newAppIcons/' + folder

	//Create folder
	Folder(newPath).create()

	//Check Aspect Ratio
	if (doc.height != doc.width) {
		alert('Please provide a square images')
		return
	}

	for (var key in dict) {
		if (dict.hasOwnProperty(key)) {
			//Store Variables
			var suffix = key
			var size = dict[key]

			//Open New Original
			var docCopy = doc.duplicate()

			//Resize
			//For ResampleMethod Reference : http://www.tipsquirrel.com/photoshops-image-size-resampling-options/
			docCopy.resizeImage(
				UnitValue(size, 'px'),
				UnitValue(size, 'px'),
				null,
				ResampleMethod.BICUBICSHARPER
			)

			//File Name
			var newFile = new File(newPath + '/' + name + suffix + '.png')

			//Save
			var pngSaveOptions = new PNGSaveOptions()
			docCopy.saveAs(newFile, pngSaveOptions, true, Extension.LOWERCASE)

			//Close
			app.activeDocument.close(SaveOptions.DONOTSAVECHANGES)
		}
	}
}
app.displayDialogs = orig_display_dialogs // Reset display dialogs
app.preferences.typeUnits = orig_type_units // Reset ruler units to original settings
app.preferences.rulerUnits = orig_ruler_units // Reset units to original settings
