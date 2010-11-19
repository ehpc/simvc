<?php

require_once 'PHPUnit/Framework.php';
require_once 'PHPUnit/Autoload.php';

require_once 'simvcTest.php';

$suite = new PHPUnit_Framework_TestSuite();
$suite->addTestSuite("SimvcTest");

?>

<pre>
<?php
PHPUnit_TextUI_TestRunner::run($suite);
?>
</pre>

