echo "build"
ng build --prod

cd dist

echo "zip"
zip -r apotik.zip apotik/

echo "ssh"
# sshpass -p "Lh-3*LxDmSz32p4$" scp -P 8288 apotik.zip root@103.82.242.11:/root
