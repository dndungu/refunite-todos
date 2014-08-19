#!/bin/sh

JAR=/usr/local/jar/yuicompressor-2.4.8.jar
ROOT=`pwd`
CSS=$ROOT"/style.css"
CSSMIN=$ROOT"/style.min-0.0.1.css"

java -jar $JAR $CSS > $CSSMIN

