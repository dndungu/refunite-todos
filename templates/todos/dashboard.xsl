<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="2.0">
 <xsl:output method="html" indent="yes" doctype-system="http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd" doctype-public="-//W3C//DTD XHTML 1.0 Strict//EN" />
  <xsl:template match="/">
		<html>
			<head>
				<link href="//netdna.bootstrapcdn.com/font-awesome/4.1.0/css/font-awesome.min.css" rel="stylesheet"/>
				<link href="//d3o8xgeetvcpmn.cloudfront.net/themes/default/default.min-0.0.2.css" rel="stylesheet" type="text/css" />
				<link href="/static/dashboard.min-0.0.1.css" rel="stylesheet" type="text/css"/>
				<title>todos app</title>
			</head>
			<body class="text-left">
				<header>
					<section>
						<section class="grid4">
							<a href="/"><h1 class="logo" style="background-image:url('/static/images/zezebox-logo.png')">zezebox</h1></a>
						</section>
						<section class="grid12 text-right">
							<nav class="half-space-top">
								<ul class="space-right">
									<li>
										<a href="/signout">Sign Out</a>
									</li>
								</ul>	
						</nav>
						</section>
					</section>
					<section>
						<ul class="clearfix">
							<li class="one-of-four pull-left">
								<h3>
									Ideas/backlog
								</h3>
							</li>
							<li class="one-of-four pull-left"><h3>Developing</h3></li>
							<li class="one-of-four pull-left"><h3>Testing</h3></li>
							<li class="one-of-four pull-left"><h3>Production</h3></li>
						</ul>
					</section>
				</header>
				<main class="row half-space-top clearfix">
					<section class="one-of-four pull-left">
						<a class="row add-item text-center" about="/api/todos" name="todo" stage="ideas-form">
							<i class="fa fa-plus-circle bubble-up"></i>
						</a>
						<div id="ideas-form"></div>
						<div id="ideas-list" class="droppable"></div>
					</section>
					<section class="one-of-four pull-left">
						<a class="row add-item text-center" about="/api/todos" name="todo" stage="developing-form">
							<i class="fa fa-plus-circle bubble-up"></i>
						</a>
						<div id="developing-form"></div>
						<div id="developing-list" class="droppable"></div>				
					</section>
					<section class="one-of-four pull-left">
						<a class="row add-item text-center" about="/api/todos" name="todo" stage="testing-form">
							<i class="fa fa-plus-circle bubble-up"></i>
						</a>
						<div id="testing-form"></div>
						<div id="testing-list" class="droppable"></div>
					</section>
					<section class="one-of-four pull-left">
						<a class="row add-item text-center" about="/api/todos" name="todo" stage="production-form">
							<i class="fa fa-plus-circle bubble-up"></i>
						</a>
						<div id="production-form"></div>
						<div id="production-list" class="droppable"></div>
					</section>
				</main>
				<footer></footer>
				<script src="/static/javascripts/src/dashboard-0.0.1.js"></script>
				<script src="/static/javascripts/lib/jquery-sizzle/sizzle.min.js"></script>
				<script src="/static/javascripts/lib/saxon/Saxonce/Saxonce.nocache.js"></script>
				<script type="text/javascript">
					var onSaxonLoad = function(){
						gereji.apps.boot();
					};
				</script>
			</body>
		</html>
  </xsl:template>
</xsl:stylesheet>
