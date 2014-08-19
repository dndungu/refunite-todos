<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0">
 <xsl:output method="html" indent="yes" doctype-system="http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd" doctype-public="-//W3C//DTD XHTML 1.0 Strict//EN" />
  <xsl:template match="/">
	<form about="/api/todos/{/data/node-0/_id}" name="todo" class="row-padding">
		<textarea name="todo" property="todo" placeholder="#critical @david create a todo app to demonstrate what your dev skills are like." rows="5" class="string required">
			<xsl:value-of select="/data/node-0/todo"/>
		</textarea>
		<br/>
		<button type="submit">Save</button>
	</form>
  </xsl:template>
</xsl:stylesheet>
