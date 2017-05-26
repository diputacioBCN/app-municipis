import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { OpenData } from '../../providers/open-data';

@Component({
  selector: 'page-pois',
  templateUrl: 'pois.html'
})

export class PoisPage {
  private ine;
  //public temaActual;

  constructor(
    public navCtrl: NavController, private navParams: NavParams, private openData: OpenData) {
    this.ine = navParams.get('ine');
    console.log('-------constructor - PoisPage: ' + this.ine);
  }

  ionViewDidLoad() {
    //this.openData.carregaPunts(this.ine);
    //this.temaActual = this.openData.puntsInfo[0]['tema'];
    //console.log(this.openData.puntsInfo[0]);
  }

}
