import {logError} from '../../util/logUtil';
import {Component, SimpleChange, Input, OnInit, OnChanges, ChangeDetectionStrategy, ElementRef} from 'angular2/core';

@Component({
	selector:'spotlight-baidu-map',
	template:'',
	changeDetection: ChangeDetectionStrategy.CheckAlways,
	directives:[]
})

export class SpotlightBaiduMap implements OnInit{
  previousMarkers: PreviousMarker[] = [];
  BMap: any;
  map: any;
  mapKey: string;
  options: MapOptions;
  win: any = window;
  element: HTMLElement;

  defaultOpts: MapDefaultOptions = {
        navCtrl: true,
        scaleCtrl: true,
        overviewCtrl: true,
        enableScrollWheelZoom: true,
        zoom: 10
  };

  constructor(public el: HTMLElement) {
  	this.element = el;
  	console.log("SpotlightBaiduMap.constructor is called.");
  }

  ngOnInit(){
  	// nothing to do
  }

  /*ngOnInit() {
	  	this.mapKey = "fDUEKjmQHlSmxNFvznHSBLGvYRNzp7E5";
        this.options = {
            center: {
                longitude: 121.506191,
                latitude: 31.245554
            },
            zoom: 17,
            markers: [{
                longitude: 121.506191,
                latitude: 31.245554,
                title: 'Where',
                content: 'Put description here'
            }]
        };

        console.log(this.options);

        this.drawBaiduMap();
    }

    ngOnChanges(changes: { [propertyName: string]: SimpleChange }) {
        var baiduMap = this.win.baiduMap;
        if (!baiduMap || baiduMap.status !== 'loaded') {
            return;
        }
        var opts = changes['options'].currentValue;
        this.center(opts);
        this.zoom(opts);
        this.mark(opts);
    }*/

    drawBaiduMap() {
        var MAPURL = `http://api.map.baidu.com/api?v=2.0&ak=${this.mapKey}&callback=baidumapinit`;

        var baiduMap = this.win.baiduMap;
        if (baiduMap && baiduMap.status === 'loading') {
            baiduMap.callbacks.push(() => {
                this.generateMap(this.element);
            });
            return;
        }

        if (baiduMap && baiduMap.status === 'loaded') {
            this.generateMap(this.element);
            return;
        }

        this.win.baiduMap = { status: 'loading', callbacks: [] };
        this.win.baidumapinit = this.getBaiduScriptLoaded(this.element);

        var script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = MAPURL;
        document.body.appendChild(script);
    }

    getBaiduScriptLoaded(el: HTMLElement) {
        return () => {
            this.win.baiduMap.status = 'loaded';
            this.generateMap(this.element);
            this.win.baiduMap.callbacks.forEach(function(cb: Function) {
                cb();
            });
            this.win.baiduMap.callbacks = [];
        };
    }

    generateMap(el: HTMLElement) {
        var BMap = this.BMap = this.win.BMap;
        var map = this.map = new BMap.Map(this.element);
        var opts = <MapOptions>Object.assign({}, this.defaultOpts, this.options);
        map.centerAndZoom(new BMap.Point(opts.center.longitude, opts.center.latitude), opts.zoom);
        if (opts.navCtrl) {
            map.addControl(new BMap.NavigationControl());
        }
        if (opts.scaleCtrl) {
            map.addControl(new BMap.ScaleControl());
        }
        if (opts.overviewCtrl) {
            map.addControl(new BMap.OverviewMapControl());
        }
        if (opts.enableScrollWheelZoom) {
            map.enableScrollWheelZoom();
        }
        this.mark(opts);
    }

    center(opts: MapOptions) {
    	console.log("enter center function");
    	console.log(opts);

        var {BMap, map} = this;
        if (opts.center) {
        	console.log(opts.cener);
            map.setCenter(new BMap.Point(opts.center.longitude, opts.center.latitude));
        }
    }

    zoom(opts: MapOptions) {
        var { map} = this;
        if (opts.zoom) {
            map.setZoom(opts.zoom);
        }
    }

    mark(opts: MapOptions) {
        var {BMap, map} = this;

        if (!opts.markers) {
            return;
        }

        for (let {marker, listener} of this.previousMarkers) {
            marker.removeEventListener('click', listener);
            map.removeOverlay(marker);
        }
        this.previousMarkers.length = 0;

        for (let marker of opts.markers) {
            var pt = new BMap.Point(marker.longitude, marker.latitude);
            var marker2: any;
            if (marker.icon) {
                var icon = new BMap.Icon(marker.icon, new BMap.Size(marker.width, marker.height));
                marker2 = new BMap.Marker(pt, {
                    icon: icon
                });
            } else {
                marker2 = new BMap.Marker(pt);
            }
            map.addOverlay(marker2);
            var previousMarker: PreviousMarker = {
                marker: marker2,
                listener: null
            };
            this.previousMarkers.push(previousMarker);

            if (!marker.title && !marker.content) {
                continue;
            }

            var infoWindow2 = new BMap.InfoWindow('<p>' + (marker.title ? marker.title : '') + '</p><p>' + (marker.content ? marker.content : '') + '</p>', {
                enableMessage: !!marker.enableMessage
            });
            previousMarker.listener = function() {
                this.openInfoWindow(infoWindow2);
            };
            marker2.addEventListener('click', previousMarker.listener);
        }
    }
}

export interface MapDefaultOptions {
    navCtrl?: boolean;
    scaleCtrl?: boolean;
    overviewCtrl?: boolean;
    enableScrollWheelZoom?: boolean;
    zoom?: number;
}

export interface PreviousMarker {
    marker: any;
    listener: Function;
}

export interface MapOptions extends MapDefaultOptions {
    center: { longitude: number, latitude: number };
    markers?: { longitude: number, latitude: number, icon?: string, width?: number, height?: number, title?: string, content?: string, enableMessage?: boolean }[];
}