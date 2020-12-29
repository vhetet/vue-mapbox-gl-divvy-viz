<template>
    <div class="container">
        <div class="station-info">
            <h3>{{ station }}</h3>
            <p>number of trips: {{ trips_number }}</p>
            <h4>Top destination</h4>
            <div class="top-destination">
                <p class="header">
                    <span class="trip-number">Number of trip</span>
                    <span class="trip-destination">Name of destination</span>
                </p>
                <p
                    v-for="(trip, i) in Object.values(markers_obj).sort((a, b) =>
            a.count < b.count ? 1 : -1
          )"
                    v-bind:key="i"
                >
                    <span class="trip-number">{{ trip.count }}</span>
                    <span
                        class="trip-destination link"
                        @click="fetchStationData(trip.station_id)"
                    >{{ trip.station_name }}</span>
                </p>
            </div>
        </div>
        <div id="map-container">
            <mapbox
                :access-token="accessToken"
                :map-options="{
          style: 'mapbox://styles/mapbox/light-v9',
          center: coordinates,
          zoom: zoom
        }"
            />
        </div>
    </div>
</template>

<script>
import axios from "axios";
import Mapbox from "mapbox-gl-vue";

export default {
    name: "station-info",
    components: {
        Mapbox
    },
    data() {
        return {
            trips: undefined,
            trips_number: 0,
            station: undefined,
            markers_obj: {},
            url: "https://data.cityofchicago.org/api/id/fg6s-gzvg.json",
            accessToken: process.env.VUE_APP_ACCESS_TOKEN,
            mapStyle: "mapbox://styles/mapbox/light-v10",
            coordinates: [-111.549668, 39.014],
            zoom: 12
        };
    },
    mounted() {
        this.fetchStationData(265);
    },
    created() {
        // We need to set mapbox-gl library here in order to use it in template
        this.mapbox = Mapbox;
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
                        (this.trips_number = response.data[0].count_start_time)
                );
        },
        fetchStationData(id) {
            this.fetchNumberOfTrip(id);

            const select =
                "select start_time, to_longitude, to_latitude, to_station_id, to_station_name, from_station_id, from_station_name, trip_duration";
            const where = `where from_station_id="${id}" and trip_duration > 120 and start_time > "2019-10-26T09:24:48.000"`;
            const orderBy = "order by start_time desc";
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
