angular
      .module("LoQueSeaModule", [])
      .controller("LoQueSeaController", LoQueSeaController);

function LoQueSeaController($scope,$http){
    $scope.metodoPago = ""; // 'T' tarjeta de credito, 'E' efectivo
	$scope.pagoElegido = 'N'; // metodo de pago elegido 'S' si 'N' no

	

};

