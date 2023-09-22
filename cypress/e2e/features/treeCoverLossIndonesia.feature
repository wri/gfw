Feature: Showing Primary Forest Loss image for Indonesia instead the real widget
  Scenario: An user tries to see Indonesia Primary Forest Loss widget
    When I visit Dashboard
    And I select Indonesia
    Then I should see an image of Indonesia Primary Forest Loss 