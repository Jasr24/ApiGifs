import { Component, ElementRef, ViewChild } from '@angular/core';
import { GifsService } from '../services/gifs.service';

@Component({
  selector: 'app-busqueda',
  templateUrl: './busqueda.component.html'
})
export class BusquedaComponent {

  @ViewChild('txtBuscar')
  txtBuscar!: ElementRef<HTMLInputElement>;  //toca poner el signo de !, el cual se conoce como no null.. o un operador para asegurarse de que el operador no es nulo, le ponemos un generico aunque si conoces los metodos yo no lo beo nesesario, es solo que con el generico le ayuda VSC a que le muestre ayudas de lo que sigue despues del .

  //Inyectamos el servicio
  constructor(private gifsService: GifsService){}

  //Asi obtenemos el valor sin nesesidad de usar el form pero para eliminar el contenido, osea que al dar enter se vuelva un string vacio en la seccion de busqueda.. se hace con el decorador @ViweChild mire arriba
  buscar(){

    const valor = this.txtBuscar.nativeElement.value;

    //con este if controlamos las busquedas vacias
    if(valor.trim().length == 0){
      alert("Debe de escribir algo pendejo.");
      this.txtBuscar.nativeElement.value = "";  //Asi lo dejamos vacio si tiene solo espacios
      return;
    }

    this.gifsService.buscarGifs(valor);
    this.txtBuscar.nativeElement.value = "";  //Asi lo dejamos vacio
  }
}
