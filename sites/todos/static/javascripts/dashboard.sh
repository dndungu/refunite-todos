#!/bin/sh

ROOT=`pwd`

JS=$ROOT"/src/dashboard-0.0.1.js"
cp -f $ROOT"/core/gereji.js" $JS
cat $ROOT"/core/gereji.broker.js" >> $JS
cat $ROOT"/core/gereji.sync.js" >> $JS
cat $ROOT"/core/gereji.storage.js" >> $JS
cat $ROOT"/core/gereji.validator.js" >> $JS
cat $ROOT"/core/gereji.transition.js" >> $JS
cat $ROOT"/core/gereji.model.js" >> $JS
cat $ROOT"/core/gereji.collection.js" >> $JS
cat $ROOT"/core/gereji.dom.js" >> $JS
cat $ROOT"/core/gereji.xslt.js" >> $JS
cat $ROOT"/core/gereji.view.js" >> $JS
cat $ROOT"/core/gereji.view.form.js" >> $JS
cat $ROOT"/core/gereji.view.list.js" >> $JS
cat $ROOT"/core/gereji.os.js" >> $JS
cat $ROOT"/apps/events.js" >> $JS
cat $ROOT"/apps/collapsible.js" >> $JS
cat $ROOT"/apps/draggable.js" >> $JS
cat $ROOT"/apps/collapsible.js" >> $JS
cat $ROOT"/apps/todos.js" >> $JS

chmod "755" $JS
