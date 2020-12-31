<template>
    <div class="container">
        <StationInfo :destinationList="markers_obj" :trips_number="trips_number" :station="station" />
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
    </div>
</template>

<script>
import axios from "axios";
import Mapbox from "mapbox-gl-vue";
import StationInfo from "./divvy-station-info.vue"

export default {
    name: "station-info",
    components: {
        Mapbox,
        StationInfo
    },
    data() {
        return {
            trips: undefined,
            trips_number: 0,
            station: undefined,
            markers_obj: {},
            url: "https://data.cityofchicago.org/api/id/fg6s-gzvg.json",
            accessToken: process.env.VUE_APP_ACCESS_TOKEN,
            mapStyle: "mapbox://styles/mapbox/light-v9",
            coordinates: [-87.6071, 41.822985],
            zoom: 12,
            map: {},
            marker: undefined
        };
    },
    mounted() {
        this.fetchStationData(265);
    },
    methods: {
        mapLoaded(map) {
            this.map = map;
            this.map.easeTo({
                center: this.coordinates
            });
            this.marker = new mapboxgl.Marker()
                .setLngLat([-87.6071, 41.822985])
                .addTo(this.map);
            if (this.trips) {
                this.trips.map(trip => {
                    new mapboxgl.Marker()
                        .setLngLat([trip.to_longitude, trip.to_latitude])
                        .addTo(this.map);
                });
            }
        },
        fetchNumberOfTrip(id) {
            const query = encodeURIComponent(
                `select count(start_time) where from_station_id="${id}" and trip_duration > 120`
            );
            const request = `${this.url}?$query=${query}`;
            axios
                .get(request)
                .then(
                    response =>
                        (this.trips_number = response.data[0].count_start_time)
                );
        },
        fetchStationData(id) {
            this.fetchNumberOfTrip(id);

            const select =
                "select start_time, from_longitude, from_latitude, to_longitude, to_latitude, to_station_id, to_station_name, from_station_id, from_station_name, trip_duration";
            const where = `where from_station_id="${id}" and trip_duration > 120 and start_time > "2019-10-26T09:24:48.000"`;
            const orderBy = "order by start_time desc limit 5";
            const query = encodeURIComponent(`${select} ${where} ${orderBy}`);
            axios.get(`${this.url}?$query=${query}`).then(response => {
                this.trips = response.data;
                this.station = this.trips[0].from_station_name;
                this.markers_obj = {};
                this.coordinates = [
                    this.trips[0].from_longitude,
                    this.trips[0].from_latitude
                ];
                if (this.map.easeTo) {
                    this.map.easeTo({
                        center: this.coordinates
                    });
                }
                if (this.marker) {
                    this.marker.remove();
                    this.marker = new mapboxgl.Marker()
                        .setLngLat(this.coordinates)
                        .addTo(this.map);
                }
                this.trips.map(m => {
                    if (this.markers_obj[m["to_station_id"]]) {
                        this.markers_obj[m["to_station_id"]].count++;
                    } else {
                        this.markers_obj[m["to_station_id"]] = {
                            count: 1,
                            station_name: m.to_station_name,
                            station_id: m.to_station_id,
                            long: parseFloat(m.to_longitude),
                            lat: parseFloat(m.to_latitude)
                        };
                    }
                });
            });
        }
    }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.container {
    display: flex;
    justify-content: space-between;

    .station-info {
        width: 450px;

        p {
            display: flex;
            justify-content: space-between;
            margin: auto;
        }

        .header {
            font-weight: bold;
        }

        span {
            padding: 4px 10px;
        }

        .trip-number {
            width: 150px;
        }

        .trip-destination {
            width: 300px;
        }

        .link {
            cursor: pointer;
        }
    }

    #map-container {
        width: 100%;
        height: 1000px;
    }

    #map {
        width: 100%;
        height: 100%;
    }
}
</style>
