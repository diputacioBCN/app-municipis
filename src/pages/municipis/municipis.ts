import { Component } from '@angular/core';
import { NavController, LoadingController} from 'ionic-angular';

import { MunicipiDetailPage } from '../municipi-detail/municipi-detail';

import { OpenData } from '../../providers/open-data';

@Component({
	selector: 'page-home',
	templateUrl: 'municipis.html'
})

export class MunicipisPage {
	public paginacio: number;
	public filtreAplicat: number[];

	constructor(public navCtrl: NavController, public openData: OpenData, public loadingCtrl: LoadingController) {}

	/*	S'executa quan la pagina s'ha carregat. Nomes s'executa una vegada per pagina creada. */
	ionViewDidLoad() {
		this.paginacio = 10;
		this.filtreAplicat = [];

		let loading = this.loadingCtrl.create({ content: 'Espereu siusplau...' });
		loading.present();
		this.openData.carregaMunicipis(loading)
		.catch((err) => { console.log('home(ionViewDidLoad) - Error: ' + err) });
	}

	/*	Aplica el filtre preguntant a la API */
	cercaMunicipis(event:any) {
		let val = event.target.value;
		if (!val || val.trim() == '') return this.filtreAplicat = [];;

		this.openData.redueixFiltrats(this.filtreAplicat,val).then((resultat: any) => {
			if (resultat[0] == undefined) {
				this.filtreAplicat = [];
				this.filtreAplicat[0] = -1;
			}
			else this.filtreAplicat = resultat;
		}).catch((err) => {console.log('ERROR - cercaMunicipis: ' + err['message'])});
	}

	/*	S'encarrega de montar l'scroll infinit */
	doInfinite(infiniteScroll) {
		if (this.filtreAplicat[0] == undefined && this.filtreAplicat[0] != -1 && this.paginacio < this.openData.municipisInfo.length) this.paginacio++;
		return infiniteScroll.complete();
	}

	/*	Navegació a la pàgina pròpia d'un municipi seleccionat */
	entraPaginaMunicipi(ine: string) {
		this.navCtrl.push(MunicipiDetailPage,{ine : ine});
	}

	/*	Guarda a la BD el canvi d'estat de preferit d'un municipi */
	canviaPreferit(ine: string) {
		this.openData.canviaPreferit(ine);
	}
}