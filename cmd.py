import os, codecs

###
def getModuleText(moduleName):
    moduleText = """<?php

class """ + moduleName.capitalize() + """ extends SimvcController
{
    public function show()
    {
        $this->simvc->pageTitle = "";
        $this->simvc->template('""" + moduleName + """.html');
    }
}

"""
    return moduleText

###
def getTemplateText(moduleName):
    templateText = """<div id=\"""" + moduleName + """">
    
</div>

"""
    return templateText

###
def getJsText(moduleName):
    jsText = """
$(document).ready(function() {

});

"""
    return jsText

###
def getCssText(moduleName):
    cssText = """
#""" + moduleName + """ {
}

"""
    return cssText
    
    
###
def newModule(moduleName):
    moduleName = moduleName.lower()
    os.mkdir(moduleName)
    os.chdir(moduleName)
    with codecs.open(moduleName + ".php", "w", "utf-8") as module:
        module.write(getModuleText(moduleName))
    with codecs.open(moduleName + ".html", "w", "utf-8") as module:
        module.write(getTemplateText(moduleName))
    with codecs.open(moduleName + ".js", "w", "utf-8") as module:
        module.write(getJsText(moduleName))
    with codecs.open(moduleName + ".css", "w", "utf-8") as module:
        module.write(getCssText(moduleName))
    os.chdir("..")
    
print """
== Simvc command-line interface ==
What to do?
1. Create new module
x. Exit
"""

while (True):
    select = raw_input("> ")
    if (select == "1"):
        print "Enter module name:"
        moduleName = raw_input(">>")
        try:
            newModule(moduleName)
            print "Module created\n"
        except Exception as inst:
            print inst
    elif (select == "x"):
        exit()
