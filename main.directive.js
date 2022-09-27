app.directive("displayNoitem", function () {
  return {
    restrict: "E",
    template:
      '<div><h1 ng-if = "products1.length === 0" >No products in this category with this price range :(</h1></div>',
  };
});
