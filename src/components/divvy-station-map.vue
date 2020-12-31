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
            this.map.easeTo({
                center: this.coordinates
            });
            this.departureMarker = new mapboxgl.Marker()
                .setLngLat([-87.6071, 41.822985])
                .addTo(this.map);
            if (this.trips) {
                // need to replace that with the marker_obj to avoid generating the same marker twice
                this.trips.map(trip => {
                    this.destinationMarkers.push(
                        new mapboxgl.Marker()
                        .setLngLat([trip.to_longitude, trip.to_latitude])
                        .addTo(this.map)
                    )
                });
            }
        }
    },
    watch: {
        trips: function(val) {
            if(this.map) {
                this.coordinates = [
                    this.trips[0].from_longitude,
                    this.trips[0].from_latitude
                ];
                if (this.map.easeTo) {
                    this.map.easeTo({
                        center: this.coordinates
                    });
                }
                if (this.departureMarker) {
                    this.departureMarker.remove();
                    this.departureMarker = new mapboxgl.Marker()
                        .setLngLat(this.coordinates)
                        .addTo(this.map);
                }
                this.destinationMarkers.map(marker => {
                    marker.remove();
                })
                this.trips.map(trip => {
                    this.destinationMarkers.push(
                        new mapboxgl.Marker()
                        .setLngLat([trip.to_longitude, trip.to_latitude])
                        .addTo(this.map)
                    )
                });
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
