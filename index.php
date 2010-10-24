<?php

include "simvc/simvc.php";

$simvc = new Simvc();
$simvc->route('GET', '/', 'Index::show');
$simvc->route('GET', '/helloworld/', 'Helloworld::show');

$simvc->run();

