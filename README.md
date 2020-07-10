# 13small-produce
produce for small scale  


# How to use
docker rmi 13small-produce  
git clone git@github.com:ubukawa/13small-produce  
cd 13small-produce  
docker build -t 13small-produce .  
docker run -it --rm -v ${PWD}:/data 13small-produce  
 
cd 13-produce-un1  
vi config/default.hjson  
mkdir /data/zxy   //mbtilesDir

rake // or node index.js or node index_africa.js  