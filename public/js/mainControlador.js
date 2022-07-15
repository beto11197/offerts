function deleteValue(value){
    const urldata="producto/eliminar/"+value
    $.get(urldata,function(data){
        alert(data)
        window.location.href = "productos";
    })
}