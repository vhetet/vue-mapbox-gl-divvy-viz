<template>
    <div id="map-container">
        <mapbox
            :access-token="accessToken"
            :map-options="{
                    style: 'mapbox://styles/mapbox/light-v9',
                    center: coordinates,
                    zoom: zoom
                }"
            @map-load="mapLoaded"
        />
    </div>
</template>

<script>
import Mapbox from "mapbox-gl-vue";

export default {
    name: "station-map",
    components: {
        Mapbox
    },
    props: {
        trips: undefined
    },
    data() {
        return {
            accessToken: process.env.VUE_APP_ACCESS_TOKEN,
            mapStyle: "mapbox://styles/mapbox/light-v9",
            coordinates: [-87.6071, 41.822985],
            zoom: 12,
            map: undefined,
            departureMarker: undefined,
            destinationMarkers: []
        };
    },
    methods: {
        mapLoaded(map) {
            this.map = map;
            this.coordinates = [this.trips[0].fromLong, this.trips[0].fromLat];
            this.map.easeTo({
                center: this.coordinates
            });
            this.addDestinationMarkers();
            this.addDepartureMarker();
        },
        addDestinationMarkers() {
            if (this.trips) {
                this.destinationMarkers.map(marker => {
                    marker.remove();
                });
                this.trips.map(trip => {
                    if ([trip.long, trip.lat] !== this.coordinates) {
                        let el = document.createElement("div");
                        el.className = "destination";
                        this.destinationMarkers.push(
                            new mapboxgl.Marker(el)
                                .setLngLat([trip.long, trip.lat])
                                .addTo(this.map)
                        );
                    }
                });
            }
        },
        addDepartureMarker() {
            if (this.departureMarker) {
                this.departureMarker.remove();
            }
            this.departureMarker = new mapboxgl.Marker()
                .setLngLat(this.coordinates)
                .addTo(this.map);
        }
    },
    watch: {
        trips: function(val) {
            if (this.map) {
                this.coordinates = [
                    this.trips[0].fromLong,
                    this.trips[0].fromLat
                ];
                if (this.map.easeTo) {
                    this.map.easeTo({
                        center: this.coordinates
                    });
                }
                this.addDestinationMarkers();
                this.addDepartureMarker();
            }
        }
    }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
#map-container {
    width: 100%;
    height: 800px;
}

#map {
    width: 100%;
    height: 100%;
}
</style>
