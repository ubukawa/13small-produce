FROM unvt/nanban:latest
WORKDIR /root

  RUN git clone https://github.com/ubukawa/13small-produce &&\
  cd 13small-produce &&\
  npm install &&\
  yarn &&\
  cd ..
