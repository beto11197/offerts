$(function(){
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const productId = urlParams.get('id')
    console.log(productId)
    let title=productId!=null?"Actualizar Producto":"Añadir Producto";
    $("#titlead").html(title)

	$("#save").click(function(){
        var datastring = $("#sendForm").serialize();
        event.preventDefault();
        let urlAction = productId!=null?"producto/modificar/"+productId:"producto/insertar"
		$.post(urlAction,datastring,function(data){
            alert(data)
            window.location.href = "productos";
		})
	})
})