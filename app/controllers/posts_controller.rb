#encoding: UTF-8
class PostsController < ApplicationController
  def show
    @post = OpenStruct.new({
      name: 'Central African Republic',
      alerts_count: 2931,
      description: (<<-EOF
        The Central African Republic (CAR) (French: République centrafricaine, pronounced: [ʁepyblik sɑ̃tʁafʁikɛn], or Centrafrique [sɑ̃tʀafʀik]; Sango Ködörösêse tî Bêafrîka), is a landlocked country in Central Africa. It borders Chad in the north, Sudan in the northeast, South Sudan in the east, the Democratic Republic of the Congo and Congo in the south, and Cameroon in the west. The CAR covers a land area of about 240,000 square miles (620,000 km2), and has an estimated population of about 4.4 million as of 2008. Bangui is the capital city.
      EOF
      ),
      last_alerts: [{:date => DateTime.new(2012, 5, 5, 16, 32), :count => 12345}] * 5
    })
  end
end
