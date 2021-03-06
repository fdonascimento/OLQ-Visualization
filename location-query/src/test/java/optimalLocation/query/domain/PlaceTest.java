package optimalLocation.query.domain;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;

public class PlaceTest {

	@Test
	public void distance_checkClosestClient() {
		//given
		Client closestClient = new Client(3D, 0D);
		Client farthestClient = new Client(5D, 0D);
		Client middleClient = new Client(4D, 0D);
		Place place = new Candidate(1D, 0D);
		
		//when
		place.addAttractedClient(middleClient);
		place.addAttractedClient(closestClient);
		place.addAttractedClient(farthestClient);
		place.calculateClosestAndFarthestClient();
		
		//then
		assertThat(place.getClosestClient()).isEqualTo(closestClient);
	}
	
	@Test
	public void distance_checkFarthestClient() {
		Client closestClient = new Client(3D, 0D);
		Client farthestClient = new Client(5D, 0D);
		Client middleClient = new Client(4D, 0D);
		Place place = new Candidate(1D, 0D);
		
		//when
		place.addAttractedClient(farthestClient);
		place.addAttractedClient(middleClient);
		place.addAttractedClient(closestClient);
		place.calculateClosestAndFarthestClient();
		
		//then
		assertThat(place.getFarthestClient()).isEqualTo(farthestClient);
	}
}
