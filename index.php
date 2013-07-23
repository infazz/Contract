<!doctype HTML>
<html lang=en>
<head>
	<meta charset="utf-8"/>
	<title>Contract</title>
	<script src="//ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js"></script>
	<script src="js/contract.js" type="text/javascript" charset="utf-8"></script>
	<script src="js/step1.js" type="text/javascript" charset="utf-8"></script>
	
	<link rel="stylesheet" href="css/styles.css" type="text/css" media="screen" title="no title" charset="utf-8">
	<link rel="stylesheet" href="css/contract.css" type="text/css" media="screen" title="no title" charset="utf-8">
	
</head>
<body>
	<div class="contract">
        
        <div id="header">
            
            <div class="content">
				<h1>Online Marketing Services Contract</h1>
				<p>This internal tool, built for use by a marketing service company's sales team, creates contracts for local small businesses. The client is shown the available services and packages and the sales person makes the selections and enters all the necessary information.</p>
				<p>The contract is validated when the users click "Continue" at the bottom of each section. If there are conflicting packages or a price has been negotiated below the minimum the user is notified. Once all information is collected and validated a digital contract is created, signed, and entered into the company's system.</p>
            </div>
            
        </div>
		<div id="main">
			
			<noscript>
				<div class="jsnote">You need JavaScript enabled to use all of the features on this page. <a href="http://enable-javascript.com/" target="_blank">See this page if you need help</a>.</div>
			</noscript>
			
			<div class="content">
				
				<div class="breadcrumbs">
					<ul>
						<li class="first current"><a href="#Services-Packages">Services &amp; Packages</a></li>
						<li><a href="#Websites">Websites</a></li>
						<li><a href="#Contact-Details">Contact Details</a></li>
						<li><a href="#Payment-Details">Payment Details<div class="arrow-after"></div><div class="arrow"></div></a></li>
						<li class="last"><a href="#Finish">Sign &amp; Finish<div class="arrow-after"></div><div class="arrow"></div></a></li>
					</ul>
				</div>
				
				<div id="PageErrors"></div>
				<form id="SigningDetails" action="javascript:void(0)" method="POST">
				<?php 
				    include_once('steps/step1.php');
					include_once('steps/step2.php');
					include_once('steps/step3.php');
					include_once('steps/step4.php');
					include_once('steps/step5.php');
				?>
				</form>
				<p class="small">Note: No data in this demo is stored anywhere. This is a client-side demo of an application and all system functionality is missing.</p>
			</div>
        </div>

        <div id="main-footer"></div>

        <footer>
			<p>Code and design by <a href="http://www.smooney.com" target="_blank">Sean Mooney</a></p>
		</footer>

    </div>
</body>
</head>