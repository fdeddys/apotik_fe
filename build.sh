echo "build"
ng build --prod

cd dist

echo "zip"
zip -r apotik.zip apotik/

echo "done"
