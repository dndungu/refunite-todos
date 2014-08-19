<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0">
 <xsl:output method="html" indent="yes" doctype-system="http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd" doctype-public="-//W3C//DTD XHTML 1.0 Strict//EN" />
  <xsl:template match="/">
		<xsl:for-each select="/data/*">
			<article class="{hashtags} draggable collapsible collapsible-close" draggable="true" name="todo">
				<p>
					<i class="fa fa-caret-right collapsible-openclose"></i><i class="fa fa-caret-down collapsible-openclose"></i>
					<span property="todo" id="{_id}" class="edit-item" about="/api/todos/{_id}" stage="{_id}" name="todo"><xsl:value-of select="todo"></span>
				</p>
			</article>
		</xsl:for-each>
  </xsl:template>
</xsl:stylesheet>
