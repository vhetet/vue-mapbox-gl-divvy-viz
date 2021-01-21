import { shallowMount } from '@vue/test-utils'
import DivvyStationContainer from '@/components/divvy-station-container.vue'

describe('divvy-station-container.vue', () => {
  const wrapper = shallowMount(DivvyStationContainer)

  it('renders when props are null/empty', () => {
    expect(wrapper.find(".container")).toBeTruthy();
  });
})
