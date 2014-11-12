this is a free transform tool for createjs canvas library witch has the follwing features:
- moveTool
- scaleTool
- hScaleTool
- vScaleTool
- rotateTool

in order to use this tool you have to do the following:
1- add a new layer to your stage in top of everything as the follwing:
  var top = new createjs.Container();
  top.name = "top";
  top.regX = -stage.width/2;
  top.regY = -stage.height/2;
  SeatingChartBuilder.stage.addChild(top);
  
2- add the transform tool inside the top layer as the follwing:
 var top = SeatingChartBuilder.stage.getChildByName("top");
 var selectTool = new createjs.util.FreeTranformTool();
 selectTool.name = "transform";
 top.addChildAt(selectTool, 0);
 
  
  

