#free transform tool for createjs canvas library 
this tool has the follwing features:
- moveTool
- scaleTool
- hScaleTool
- vScaleTool
- rotateTool

in order to use this tool you have to do the following:
1- add a new layer to your stage in top of everything as the follwing:

```
  var top = new createjs.Container();
  top.name = "top";
  stage.addChildAt(top,0);
```

  
2- add the transform tool inside the top layer as the follwing:

```
 var selectTool = new createjs.util.FreeTranformTool();
 selectTool.name = "transform";
 top.addChildAt(selectTool, 0);
 ```
3- to select any object for example when the user click on that object as the following:
```
 object.addEventListener("click", function (evt) {
      selectTool.select(evt.currentTarget,stage);
  });
```
4- to unselect object  for example when the user click on the stage as the following:
```
stage.addEventListener("click", function () {
    selectTool.unselect();
});
```


