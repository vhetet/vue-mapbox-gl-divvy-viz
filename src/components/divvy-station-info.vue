<template>
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
                v-for="(trip, i) in Object.values(destinationList).sort((a, b) =>
                        a.count < b.count ? 1 : -1
                    )"
                v-bind:key="i"
            >
                <span class="trip-number">{{ trip.count }}</span>
                <span
                    class="trip-destination link"
                    @click="changeStation(trip.station_id)"
                >{{ trip.station_name }}</span>
            </p>
        </div>
    </div>
</template>

<script>
export default {
    name: "station-info",
    props: {
        destinationList: {},
        trips_number: 0,
        sation: ''
    },
    data() {
        return {
            station: undefined
        };
    },
    methods: {
        changeStation(id) {
            console.log('click')
            this.$emit('stationChange', id)
        }
    }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
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
</style>
