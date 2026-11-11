' Cree le raccourci "Seconde Maille" (avec son icone) sur le Bureau et dans le menu Demarrer.
Option Explicit
Dim sh, fso, here, target, icon, places, p, lnk
Set sh = CreateObject("WScript.Shell")
Set fso = CreateObject("Scripting.FileSystemObject")
here = fso.GetParentFolderName(WScript.ScriptFullName)
target = here & "\Seconde Maille.vbs"
icon = here & "\seconde-maille.ico"
places = Array(sh.SpecialFolders("Desktop"), sh.SpecialFolders("Programs"))
For Each p In places
  Set lnk = sh.CreateShortcut(p & "\Seconde Maille.lnk")
  lnk.TargetPath = sh.ExpandEnvironmentStrings("%WINDIR%") & "\System32\wscript.exe"
  lnk.Arguments = Chr(34) & target & Chr(34)
  lnk.WorkingDirectory = here
  lnk.IconLocation = icon & ",0"
  lnk.Description = "Seconde Maille - l'appli"
  lnk.Save
Next
MsgBox "Raccourci Seconde Maille cree sur le Bureau et dans le menu Demarrer.", vbInformation, "Seconde Maille"
