package optimalLocation.core;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import optimalLocation.query.LocationQuery;
import optimalLocation.query.domain.Candidates;
import optimalLocation.query.domain.Clients;
import optimalLocation.query.domain.Facilities;
import optimalLocation.query.domain.LocationQueryResult;
import optimalLocation.query.providers.CandidateProvider;
import optimalLocation.query.providers.ClientProvider;
import optimalLocation.query.providers.FacilityProvider;

@Component
public class OptimalLocationQuery {

	private ClientProvider clientProvider;
	private FacilityProvider facilityProvider;
	private CandidateProvider candidateProvider;
	private LocationQuery locationQuery;

	@Autowired
	public void setClientProvider(ClientProvider clientProvider) {
		this.clientProvider = clientProvider;
	}

	@Autowired
	public void setFacilityProvider(FacilityProvider facilityProvider) {
		this.facilityProvider = facilityProvider;
	}

	@Autowired
	public void setCandidateProvider(CandidateProvider candidateProvider) {
		this.candidateProvider = candidateProvider;
	}

	@Autowired
	public void setLocationQuery(LocationQuery locationQuery) {
		this.locationQuery = locationQuery;
	}
	
	public LocationQueryResult findBestLocation() {
		Clients clients = clientProvider.getClients();
		Candidates candidates = candidateProvider.getCandidates();
		Facilities facilities = facilityProvider.getFacilities();
		return locationQuery.run(clients, facilities, candidates);
	}
}
