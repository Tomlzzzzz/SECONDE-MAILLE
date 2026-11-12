' =====================================================================
'  SECONDE MAILLE - lanceur Windows
'  Double-clic : met l'appli a jour si besoin, demarre le serveur local
'  (invisible) puis ouvre l'appli
'  dans sa propre fenetre format telephone (Edge ou Chrome en mode appli).
'  A la fermeture de la fenetre, le serveur s'arrete.
' =====================================================================
Option Explicit
Dim sh, fso, here, root, port, url, profile, browser, w, h, x, y, args, q
Set sh = CreateObject("WScript.Shell")
Set fso = CreateObject("Scripting.FileSystemObject")
here = fso.GetParentFolderName(WScript.ScriptFullName)
root = fso.GetParentFolderName(here)
port = "5180"
url = "http://localhost:" & port & "/"
q = Chr(34)

' 1. Node.js present ?
If sh.Run("cmd /c where node >nul 2>nul", 0, True) <> 0 Then
  MsgBox "Node.js est necessaire pour lancer Seconde Maille." & vbCrLf & "Installe-le depuis https://nodejs.org puis relance.", vbExclamation, "Seconde Maille"
  WScript.Quit 1
End If

' 2. Mise a jour automatique : a chaque lancement, on verifie si l'appli
'    a ete modifiee (src, public, .env.local, package.json...) et on la
'    recompile si besoin. Si rien n'a change, l'appli s'ouvre tout de suite.
Dim status, cmd
status = sh.Run("cmd /c cd /d " & q & root & q & " && node lanceur\update.mjs", 0, True)
If status = 10 Or status = 11 Then
  cmd = "cmd /c title Seconde Maille - mise a jour && cd /d " & q & root & q & " && echo. && echo   SECONDE MAILLE : mise a jour de l'appli... && echo   (cette fenetre se ferme toute seule) && echo."
  If status = 11 Then cmd = cmd & " && (call npm install || ver>nul)"
  cmd = cmd & " && call npm run build"
  If sh.Run(cmd, 1, True) <> 0 Then
    If fso.FileExists(root & "\dist\index.html") Then
      MsgBox "La mise a jour a echoue : l'appli s'ouvre dans sa version precedente." & vbCrLf & "Pour voir l'erreur : ouvre un terminal dans appli-seconde-maille et lance  npm run build", vbExclamation, "Seconde Maille"
    Else
      MsgBox "La preparation a echoue. Ouvre un terminal dans le dossier appli-seconde-maille et lance : npm install puis npm run build", vbCritical, "Seconde Maille"
      WScript.Quit 1
    End If
  End If
End If

' 3. Serveur local invisible
sh.Run "cmd /c cd /d " & q & root & q & " && node lanceur\serve.mjs", 0, False
WScript.Sleep 900

' 4. Fenetre format telephone, centree
w = 430 : h = 900
x = 200 : y = 40
On Error Resume Next
Dim wmi, mon
Set wmi = GetObject("winmgmts:\\.\root\cimv2")
For Each mon In wmi.ExecQuery("Select * from Win32_VideoController")
  If mon.CurrentHorizontalResolution > 0 Then
    x = Int((mon.CurrentHorizontalResolution - w) / 2)
    If mon.CurrentVerticalResolution < 1000 Then h = mon.CurrentVerticalResolution - 80
    Exit For
  End If
Next
On Error GoTo 0

profile = sh.ExpandEnvironmentStrings("%LOCALAPPDATA%") & "\SecondeMaille\profil"
args = " --app=" & url & " --user-data-dir=" & q & profile & q & " --window-size=" & w & "," & h & " --window-position=" & x & "," & y & " --no-first-run --no-default-browser-check"

browser = ""
Dim candidates, c
candidates = Array( _
  sh.ExpandEnvironmentStrings("%ProgramFiles(x86)%") & "\Microsoft\Edge\Application\msedge.exe", _
  sh.ExpandEnvironmentStrings("%ProgramFiles%") & "\Microsoft\Edge\Application\msedge.exe", _
  sh.ExpandEnvironmentStrings("%ProgramFiles%") & "\Google\Chrome\Application\chrome.exe", _
  sh.ExpandEnvironmentStrings("%ProgramFiles(x86)%") & "\Google\Chrome\Application\chrome.exe", _
  sh.ExpandEnvironmentStrings("%LOCALAPPDATA%") & "\Google\Chrome\Application\chrome.exe")
For Each c In candidates
  If browser = "" And fso.FileExists(c) Then browser = c
Next

If browser = "" Then
  ' pas d'Edge/Chrome : navigateur par defaut
  sh.Run url
  WScript.Quit 0
End If

' 5. On attend la fermeture de la fenetre, puis on arrete le serveur
sh.Run q & browser & q & args, 1, True
WScript.Sleep 1500
Dim p
For Each p In GetObject("winmgmts:\\.\root\cimv2").ExecQuery("Select * from Win32_Process Where Name='node.exe'")
  If InStr(1, p.CommandLine, "serve.mjs", 1) > 0 Then p.Terminate
Next
