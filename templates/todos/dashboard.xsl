<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="2.0">
 <xsl:output method="html" indent="yes" doctype-system="http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd" doctype-public="-//W3C//DTD XHTML 1.0 Strict//EN" />
  <xsl:template match="/">
		<html>
			<head>
				<link href='//fonts.googleapis.com/css?family=Open+Sans:300,400' rel='stylesheet' type='text/css'/>
				<link href="//netdna.bootstrapcdn.com/font-awesome/4.1.0/css/font-awesome.min.css" rel="stylesheet"/>
				<link href="//d3o8xgeetvcpmn.cloudfront.net/themes/default/default.min-0.0.2.css" rel="stylesheet" type="text/css" />
				<link href="/static/dashboard.css" rel="stylesheet" type="text/css"/>
				<script src="//localhost/ui/javascripts/core/gereji.js"></script>
				<script src="/static/javascripts/core/gereji.broker.js"></script>
				<script src="/static/javascripts/core/gereji.sync.js"></script>
				<script src="/static/javascripts/core/gereji.storage.js"></script>
				<script src="/static/javascripts/core/gereji.transition.js"></script>
				<script src="/static/javascripts/core/gereji.xslt.js"></script>
				<script src="/static/javascripts/core/gereji.collection.js"></script>
				<script src="/static/javascripts/core/gereji.model.js"></script>
				<script src="/static/javascripts/core/gereji.view.js"></script>
				<script src="/static/javascripts/core/gereji.view.form.js"></script>
				<script src="/static/javascripts/core/gereji.view.list.js"></script>
				<script src="/static/javascripts/core/gereji.validator.js"></script>
				<script src="/static/javascripts/core/gereji.query.js"></script>
				<script src="/static/javascripts/core/gereji.os.js"></script>
				<script src="/static/javascripts/apps/events.js"></script>
				<script src="/static/javascripts/apps/draggable.js"></script>
				<script src="/static/javascripts/apps/collapsible.js"></script>
				<script src="/static/javascripts/apps/todos.js"></script>
				<script src="/static/javascripts/lib/jquery-sizzle/sizzle.min.js"></script>
				<title>todos app</title>
			</head>
			<body class="text-left">
				<header>
					<section>
						<section class="grid4">
							<h1 class="logo" style="background-image:url('http://static.tumblr.com/38268994e866d2ff8a65f4e0ac581d5a/h7mcdlm/rTMn443cb/tumblr_static_choek05a1y0c0w088oooowwc4.png')">zezebox</h1>
						</section>
						<section class="grid12 text-right">
							<nav class="half-space-top">
								<ul class="space-right">
									<li>
										<a href="/sign-out">Sign Out</a>
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
				<script type="text/javascript">gereji.apps.boot();</script>
			</body>
		</html>
  </xsl:template>
</xsl:stylesheet>
