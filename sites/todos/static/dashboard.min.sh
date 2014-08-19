#!/bin/sh

JAR=/usr/local/jar/yuicompressor-2.4.8.jar
ROOT=`pwd`
CSS=$ROOT"/dashboard.css"
CSSMIN=$ROOT"/dashboard.min-0.0.1.css"

java -jar $JAR $CSS > $CSSMIN

