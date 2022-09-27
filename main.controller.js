app.controller("EcommerceController", EcommerceController);

EcommerceController.$inject = ["$scope", "$http"];

function EcommerceController($scope, $http) {
  $scope.limitToBegin = 0;
  $scope.cartArray = [];
  $scope.cartHide = false;
  $scope.hideCartItems = true;
  $scope.hideProductsItem = false;
  $scope.selectedPrice = "";
  $scope.selectedCategory = "";
  $scope.totalAmount = 0;

  $scope.showHome = function () {
    $scope.hideCartItems = true;
    $scope.hideProductsItem = false;
    $scope.cartHide = false;
  };

  $scope.cartClicked = function () {
    $scope.totalAmount = 0;
    $scope.limitToBeginCart = 0;
    $scope.cartHide = true;
    $scope.hideCartItems = false;
    $scope.hideProductsItem = true;
    $scope.totalAmountAndButton = false;

    if ($scope.cartArray.length === 0) {
      $scope.totalAmountAndButton = true;
      return;
    } else if ($scope.cartArray.length === 1) {
      $scope.totalAmount = $scope.cartArray[0].salePrice;
    } else {
      console.log($scope.cartArray);
      $scope.cartArray.map(
        (eachItem) => ($scope.totalAmount += eachItem.salePrice)
      );
      console.log($scope.totalAmount);
    }
  };

  $http.get("products.json").then(function (response) {
    $scope.products = angular.fromJson(response.data.products);

    for (let i = 0; i < $scope.products.length; i++) {
      if ($scope.products[i].salePrice <= 50) {
        $scope.products[i].salePrice_range = "1 - 50";
      } else if ($scope.products[i].salePrice <= 100) {
        $scope.products[i].salePrice_range = "51 - 100";
      } else if ($scope.products[i].salePrice <= 200) {
        $scope.products[i].salePrice_range = "101 - 200";
      } else if ($scope.products[i].salePrice <= 500) {
        $scope.products[i].salePrice_range = "201 - 500";
      } else if ($scope.products[i].salePrice <= 2000) {
        $scope.products[i].salePrice_range = "501 - 2000";
      } else if ($scope.products[i].salePrice <= 5000) {
        $scope.products[i].salePrice_range = "2001 - 5000";
      } else if ($scope.products[i].salePrice > 5000) {
        $scope.products[i].salePrice_range = "> 5000";
      }
    }

    console.log($scope.products);
    $scope.products1 = $scope.products;
    $scope.onlyUnique = function (value, index, self) {
      return self.indexOf(value) === index;
    };

    $scope.categoryChanged = function () {
      $scope.limitToBegin = 0;
      if ($scope.selectedCategory == "" && $scope.selectedPrice == "") {
        $scope.products1 = $scope.products;
      } else if ($scope.selectedPrice == "") {
        $scope.products1 = $scope.products.filter(
          (eachItem) => eachItem.categories[0] == $scope.selectedCategory
        );
      } else {
        if ($scope.selectedCategory == "") {
          $scope.products1 = $scope.products.filter(
            (eachItem) => eachItem.salePrice_range == $scope.selectedPrice
          );
        } else {
          $scope.products1 = $scope.products.filter(
            (eachItem) =>
              eachItem.categories[0] == $scope.selectedCategory &&
              eachItem.salePrice_range == $scope.selectedPrice
          );
        }
      }
      if ($scope.products1.length <= 50) {
        $scope.disablePreviousButton = true;
        $scope.disableNextButton = true;
      } else {
        $scope.disablePreviousButton = true;
        $scope.disableNextButton = false;
      }
    };

    $scope.priceChanged = function () {
      $scope.limitToBegin = 0;
      console.log($scope.selectedPrice);
      if ($scope.selectedCategory == "" && $scope.selectedPrice == "") {
        $scope.products1 = $scope.products;
        console.log("if1");
      } else if ($scope.selectedCategory == "") {
        console.log("if2");
        $scope.products1 = $scope.products.filter(
          (eachItem) => eachItem.salePrice_range == $scope.selectedPrice
        );
      } else {
        console.log("if3");
        if ($scope.selectedPrice == "") {
          $scope.products1 = $scope.products.filter(
            (eachItem) => eachItem.categories[0] == $scope.selectedCategory
          );
        } else {
          $scope.products1 = $scope.products.filter(
            (eachItem) =>
              eachItem.categories[0] == $scope.selectedCategory &&
              eachItem.salePrice_range == $scope.selectedPrice
          );
        }
      }
      if ($scope.products1.length <= 50) {
        $scope.disablePreviousButton = true;
        $scope.disableNextButton = true;
      } else {
        $scope.disablePreviousButton = true;
        $scope.disableNextButton = false;
      }
    };

    $scope.categoryList = $scope.products
      .map((eachItem) => eachItem.categories[0])
      .filter((each) => each !== null)
      .filter($scope.onlyUnique);

    $scope.priceList = [
      "1 - 50",
      "51 - 100",
      "101 - 200",
      "201 - 500",
      "501 - 2000",
      "2001 - 5000",
      "> 5000",
    ];

    $scope.increaseQuantity = function (item) {
      for (let i = 0; i < $scope.cartArray.length; i++) {
        if ($scope.cartArray[i].objectID == item.objectID) {
          $scope.cartArray[i].quantity += 1;
          $scope.totalAmount += $scope.cartArray[i].salePrice;

          return;
        }
      }
    };

    $scope.decreaseQuantity = function (item) {
      for (let i = 0; i < $scope.cartArray.length; i++) {
        if ($scope.cartArray[i].objectID == item.objectID) {
          if (item.quantity > 1) {
            $scope.cartArray[i].quantity -= 1;
            $scope.totalAmount -= $scope.cartArray[i].salePrice;
          }

          return;
        }
      }
    };

    $scope.addToCart = function (item, id) {
      if (
        $scope.cartArray.filter(
          (eachItem) => eachItem.objectID === item.objectID
        ).length === 0
      ) {
        $scope.products1.map((eachItem) => {
          if (eachItem.objectID === id) {
            eachItem.isInCart = true;
            return;
          }
        });

        item.quantity = 1;
        $scope.cartArray.push(item);
        $scope.cartCount = $scope.cartArray.length;
        console.log($scope.cartArray);
      }
    };

    $scope.removeFromCart = function (id) {
      for (let j = 0; j < $scope.cartArray.length; j++) {
        if ($scope.cartArray[j].objectID == id) {
          console.log(id);

          $scope.cartArray.splice(j, 1);
          $scope.cartCount = $scope.cartArray.length;
          break;
        }
      }

      for (let k = 0; k < $scope.products1.length; k++) {
        if ($scope.products1[k].objectID == id) {
          $scope.products1[k].isInCart = false;
          break;
        }
      }
    };

    $scope.removeFromActualCart = function (id) {
      $scope.totalAmount = 0;
      for (let j = 0; j < $scope.cartArray.length; j++) {
        if ($scope.cartArray[j].objectID == id) {
          $scope.cartArray.splice(j, 1);
          $scope.cartCount = $scope.cartArray.length;
        }
      }

      $scope.cartArray.map(
        (eachItem) =>
          ($scope.totalAmount += eachItem.salePrice * eachItem.quantity)
      );

      if ($scope.cartArray.length === 0) {
        $scope.totalAmountAndButton = true;
      }

      for (let k = 0; k < $scope.products1.length; k++) {
        if ($scope.products1[k].objectID == id) {
          $scope.products1[k].isInCart = false;
          break;
        }
      }
    };

    $scope.previousPage = function () {
      if ($scope.limitToBegin > 0) {
        $scope.limitToBegin -= 50;
      }

      if ($scope.limitToBegin == 0) {
        $scope.disablePreviousButton = true;
      }

      $scope.disableNextButton = false;

      window.scroll({
        top: 0,
        left: 0,
        behavior: "smooth",
      });
    };

    $scope.nextPage = function () {
      if ($scope.products1.length >= $scope.limitToBegin + 50) {
        $scope.disablePreviousButton = false;
        $scope.limitToBegin += 50;
      }

      if ($scope.limitToBegin + 50 >= $scope.products1.length) {
        $scope.disableNextButton = true;
      }

      window.scroll({
        top: 0,
        left: 0,
        behavior: "smooth",
      });
    };

    if ($scope.products1.length <= 50) {
      $scope.disablePreviousButton = true;
      $scope.disableNextButton = true;
    } else {
      $scope.disablePreviousButton = true;
      $scope.disableNextButton = false;
    }
  });

  $scope.checkoutClicked = function () {
    $scope.cartArray = [];
    $scope.totalAmount = 0;
    $scope.cartCount = 0;
    $scope.totalAmountAndButton = true;
    $scope.products1.map((eachItem) => (eachItem.isInCart = false));
  };
}
