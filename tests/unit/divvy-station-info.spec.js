import { shallowMount } from '@vue/test-utils'
import DivvyStationInfo from '@/components/divvy-station-info.vue'

describe('divvy-station-info.vue', () => {
  const wrapper = shallowMount(DivvyStationInfo)

  it('renders when props are null/empty', () => {
    expect(wrapper.find(".total-trip-number").text()).toContain("number of trips");
    expect(wrapper.findAll(".trip-number").length).toBe(1);
    expect(wrapper.find(".trip-number").text()).toContain("Number of trip");
    expect(wrapper.findAll(".trip-destination").length).toBe(1);
    expect(wrapper.find(".trip-destination").text()).toContain("Name of destination");
  });

  it('renders list of destinations', async () => {
    await wrapper.setProps({
      tripsNumber: 5555,
      destinationList: [
        { "count": 6, "station_name": "Cottage Grove Ave & 47th St", "station_id": "336", "long": -87.606755, "lat": 41.809855, "fromLong": -87.6071, "fromLat": 41.822985 },
        { "count": 3, "station_name": "Cottage Grove Ave & Oakwood Blvd", "station_id": "265", "long": -87.6071, "lat": 41.822985, "fromLong": -87.6071, "fromLat": 41.822985 },
        { "count": 2, "station_name": "MLK Jr Dr & Pershing Rd", "station_id": "179", "long": -87.61678, "lat": 41.8246, "fromLong": -87.6071, "fromLat": 41.822985 },
        { "count": 1, "station_name": "University Ave & 57th St", "station_id": "423", "long": -87.599861, "lat": 41.791478, "fromLong": -87.6071, "fromLat": 41.822985 }
      ]
    });
    expect(wrapper.find(".total-trip-number").text()).toContain("number of trips: 5555");
    expect(wrapper.findAll(".trip-number").length).toBe(5);
    expect(wrapper.findAll(".trip-number").at(1).text()).toContain("6");
    expect(wrapper.findAll(".trip-destination").length).toBe(5);
    expect(wrapper.findAll(".trip-destination").at(1).text()).toContain("Cottage Grove Ave & 47th St");
  });

  it('emit event when a station name is clicked', async () => {
    await wrapper.setProps({
      tripsNumber: 5555,
      destinationList: [
        { "count": 6, "station_name": "Cottage Grove Ave & 47th St", "station_id": "336", "long": -87.606755, "lat": 41.809855, "fromLong": -87.6071, "fromLat": 41.822985 }
      ]
    });
    wrapper.vm.$emit = jest.fn();
    expect(wrapper.findAll(".trip-destination").at(1).text()).toContain("Cottage Grove Ave & 47th St");
    expect(wrapper.vm.$emit).toHaveBeenCalledTimes(0);

    await wrapper.findAll(".trip-destination").at(1).trigger('click');
    expect(wrapper.vm.$emit).toHaveBeenCalledTimes(1);
    expect(wrapper.vm.$emit).toHaveBeenCalledWith("stationChange", "336");
  });
})
