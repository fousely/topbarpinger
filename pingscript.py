import subprocess

process = subprocess.Popen(['ping', '-w', '1', '-c', '1', '4.4.4.4'], stdout=subprocess.PIPE)
output = process.stdout.read()
print(output)
return 1
