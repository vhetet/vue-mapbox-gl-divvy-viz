<template>
    <div class="container">
        <StationInfo :destinationList="markers_obj" :tripsNumber="tripsNumber" :station="station" @stationChange="fetchStationData" />
        <StationMap :trips="trips" />
    </div>
</template>

<script>
import axios from "axios";
import Mapbox from "mapbox-gl-vue";
import StationInfo from "./divvy-station-info.vue"
import StationMap from "./divvy-station-map.vue"

export default {
    name: "station-container",
    components: {
        Mapbox,
        StationInfo,
        StationMap
    },
    data() {
        return {
            trips: [],
            tripsNumber: 0,
            station: undefined,
            markers_obj: {},
            url: "https://data.cityofchicago.org/api/id/fg6s-gzvg.json"
        };
    },
    mounted() {
        this.fetchStationData(265);
    },
    methods: {
        fetchNumberOfTrip(id) {
            const query = encodeURIComponent(
                `select count(start_time) where from_station_id="${id}" and trip_duration > 120`
            );
            const request = `${this.url}?$query=${query}`;
            axios
                .get(request)
                .then(
                    response =>
                        (this.tripsNumber = response.data[0].count_start_time)
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
}
</style>
