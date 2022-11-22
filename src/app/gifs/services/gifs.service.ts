import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SearchGifsResponse, Gif } from '../interfaces/gifs.interface';

@Injectable({
  providedIn: 'root'
})
export class GifsService {

  private apiKey: string = "4uu2YdW62g8Yt5dmrm6mlC8LNt07LJDO"; //-> lo sacamos de la pagina developers.giphy.com
  private servicioUrl: string = "http://api.giphy.com/v1/gifs";
  private _historial: string[] = [];  //Aqui lo dejamos privado y abajo creamos el get para poder acceder aqui.

  public resultados: Gif[] = [];

  get historial(){
    return [...this._historial];  //... se usa para romper la relacion ya que de lo contrario si accediento a este metodo get realizamos una modificacion podemos modificar el original.. operadpr espread...
  }

  //Los constructores de los servicios solo se ejecutan una vez, trabajan como singleton
  constructor(private http: HttpClient){
    //Lo siguiente es para obtener del LOCALSTORAGE hay 2 forma con el if.. y lo que hay despues
    /*if ( localStorage.getItem('historial')){
      this._historial = JSON.parse(localStorage.getItem('historial')!) ;
    }*/
    this._historial = JSON.parse(localStorage.getItem('historial')!) || [];  //|| [] es por si esta vacio para que no nos de error en la ejecucion del programa
    this.resultados = JSON.parse(localStorage.getItem("resultados")!) || "";
  }
  
  buscarGifs(query: string = ''){

    query = query.trim().toLowerCase();
    
    //Con lo siguiente evitamos los duplicados.. si no esta dentro del arreglo lo insertamos
    if(!this._historial.includes(query)){
      this._historial.unshift(query)  //unshif inserta al inicio de un arreglo
    
      //Con la linea siguiente liminamos la cantidad de inserciones del historial, le pondremos max 10
      this._historial = this._historial.splice(0,10);


      //Lo siguiente es para grabar en el LOCALSTORAGE
      localStorage.setItem("historial", JSON.stringify(this._historial));
    }

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //HACEMOS EL LLAMADO A LA PAGINA WEB

    //Lo que sigue con JavaScripth
    /*fetch('http://api.giphy.com/v1/gifs/search?api_key=4uu2YdW62g8Yt5dmrm6mlC8LNt07LJDO&q=dragon ball z&limit=10')
        .then(resp => {
          resp.json().then(data => console.log(data))
        })*/

    /*/Asiendo con el async que va al principio del metodo async buscarGifs ...... y lo siguiente  (Lo cual es mas limpio que lo de atras)
    const resp = await fetch('http://api.giphy.com/v1/gifs/search?api_key=4uu2YdW62g8Yt5dmrm6mlC8LNt07LJDO&q=dragon ball z&limit=10')
    const data = await resp.json();
    console.log(data);*/


    const params = new HttpParams()
              .set('api_key',this.apiKey)
              .set('limit', "20")
              .set('q',query);

    //PERO LO SIGUIENTE ES LO RECOMENDADO 1. importamos el modulo HttpClientModule.. para poder inyectar HttpClient.. el cual lo inyectamos en el constructor. la cual podemos usar para poder usar post delecte get put etc lo cuales retornan obserbables
    //this.http.get<SearchGifsResponse>(`${this.servicioUrl}/search?${params}`)
    this.http.get<SearchGifsResponse>(`${this.servicioUrl}/search`, {params: params})
              .subscribe((resp) => {
                this.resultados = resp.data;
                localStorage.setItem("resultados", JSON.stringify(this.resultados));
              })

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  }
}
