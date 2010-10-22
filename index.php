<?php

include "simvc/simvc.php";

$simvc = new Simvc();
$simvc->route('GET', '/', 'Index::show', 'Homepage');
$simvc->route('GET', '/helloworld/', 'Helloworld::show', 'Hello world module');

$simvc->run();

