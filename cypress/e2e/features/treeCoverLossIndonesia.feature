Feature: Indonesia TCL Image
  Scenario: Indonesia Dashboard should show an image instead the real Primay Forest Loss Widget
    When I visit Dashboard
    And I select Indonesia
    Then I should see an image of Indonesia Primary Forest Loss 