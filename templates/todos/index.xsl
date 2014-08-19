<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="2.0">
  <xsl:output method="html" indent="yes" doctype-system="http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd" doctype-public="-//W3C//DTD XHTML 1.0 Strict//EN" />
  <xsl:template match="/">
    <html>
      <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
        <title>todos app</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta property="fb:app_id" content="521751674619870" />
        <meta property="og:url" content="" />
        <meta property="og:title" content="" />
        <meta property="og:site_name" content="" />
        <meta property="og:description" content="" />
        <meta property="og:image" content="" />
        <meta property="og:locale" content="" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link href="//d3o8xgeetvcpmn.cloudfront.net/themes/default/default.min-0.0.2.css" rel="stylesheet" type="text/css" />
        <link href="/static/style.css" rel="stylesheet" type="text/css" />
        <link rel="icon" href="/favicon.ico" sizes="16x16 32x32 48x48 64x64" type="image/vnd.microsoft.icon" />
      </head>
      <body class="color-one">
        <header class="row row-padding">
          <section class="container clearfix">
            <h1 class="pull-left">
              <a href="/" class="pull-left">
                <img src="/static/images/zezebox-logo.png" height="48" class="logo pull-left" alt="zezebox" />
              </a>
            </h1>
            <nav class="pull-right">
              <ul class="navigation-horizontal">
                <li>
                  <a href="/">Home</a>
                </li>
                <li>
                  <a href="https://github.com/dnjuguna/refunite-todos">Source</a>
                </li>
              </ul>
            </nav>
          </section>
        </header>
        <main class="row home-main">
          <section class="container">
			<section class="home-main-image"></section>
            <section class="row text-center">
			  <h1>Sign up for the worlds easiest todo app.</h1>
              <ul class="activate-networks space-top">
                <li class="color-three">
                  <a href="/oauth/connect/facebook-signup/dashboard">
                    <i class="fa fa-facebook"></i>
                    <span>Sign up in with facebook</span>
                  </a>
                </li>
                <li class="color-three">
                  <a href="/oauth/connect-twitter/dashboard">
                    <i class="fa fa-twitter"></i>
                    <span>Sign up with twitter</span>
                  </a>
                </li>
                <li class="color-three">
                  <a href="/oauth/connect/linkedin-profile/dashboard">
                    <i class="fa fa-linkedin"></i>
                    <span>Sign up with linkedin</span>
                  </a>
                </li>
              </ul>
            </section>
          </section>
        </main>
        <footer class="row">
          <section class="container">
            <p class="text-center row-padding">&#169; 2014 David Njuguna. All rights reserved. 
            <a href="/privacy">Privacy Policy.</a>
            <a href="/terms">Terms of Use.</a></p>
          </section>
        </footer>
        <script type="text/javascript">
			function i(e){var h = document.getElementsByTagName('head')[0];h.parentNode.insertBefore(e, h);};
			function c(p){var l = document.createElement('link');l.rel = 'stylesheet';l.href = p;i(l);}
			c("//maxcdn.bootstrapcdn.com/font-awesome/4.1.0/css/font-awesome.min.css");
			function j(p, t){ var s = document.createElement('script'); s.src = p; i(s);
				if(!s.readyState)
					return (s.onload = t);
				s.onreadystatechange = function(){
					if(["loaded", "complete"].indexOf(s.readyState) == -1)
						return; t();
					s.onreadystatechange = null;
				}
			}
		</script>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>
